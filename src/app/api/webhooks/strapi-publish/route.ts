// app/api/webhooks/strapi-publish/route.ts

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_BASE_URL}${url}`;
}

export async function POST(req: Request) {
  // 1. Verify the webhook secret
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = await req.json();

  // 2. Only act on publish events for the "blog" collection
  if (payload.event !== 'entry.publish' || payload.model !== 'blog') {
    return new Response('Ignored', { status: 200 });
  }

  let entry = payload.entry;

  // 3. Fallback: if thumbnail/metadata aren't populated in the webhook payload,
  // fetch the full entry from Strapi's REST API with deep population.
  // Remove this block if your test webhook payload already includes full data.
  const needsRefetch = !entry.thumbnail?.url && !entry.metadata?.description;

  if (needsRefetch && entry.id) {
    try {
      const refetchRes = await fetch(
        `${STRAPI_BASE_URL}/api/blogs/${entry.id}?populate=thumbnail&populate=metadata.image`,
        { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
      );

      if (refetchRes.ok) {
        const refetched = await refetchRes.json();
        entry = { ...entry, ...refetched.data?.attributes };
      } else {
        console.error('Failed to refetch entry from Strapi:', refetchRes.status);
      }
    } catch (err) {
      console.error('Error refetching entry from Strapi:', err);
    }
  }

  // 4. Extract the fields we need
  const postTitle: string = entry.title ?? 'New post';
  const postSlug: string = entry.slug;
  const postExcerpt: string = entry.metadata?.description ?? '';
  const postUrl = `${SITE_URL}/blog/${postSlug}`;

  const rawThumbnailUrl = entry.thumbnail?.url ?? entry.metadata?.image?.url ?? '';
  const coverImageUrl = resolveMediaUrl(rawThumbnailUrl);

  // 5. Create the draft campaign
  try {
    const createRes = await fetch('https://app.loops.so/api/v1/campaigns', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `New post: ${postTitle}` }),
    });

    if (!createRes.ok) {
      console.error('Failed to create campaign:', createRes.status, await createRes.text());
      return new Response('Failed to create campaign', { status: 502 });
    }

    const { emailMessageId, emailMessageContentRevisionId } = await createRes.json();

    // 6. Build the LMX content
    const lmxContent = `
<Style themeId="st_default" />
${
  coverImageUrl
    ? `<Image src="${escapeXml(coverImageUrl)}" alt="${escapeXml(postTitle)}" width="560" align="center" />`
    : ''
}
<H1 align="center">${escapeXml(postTitle)}</H1>
${postExcerpt ? `<Paragraph align="center">${escapeXml(postExcerpt)}</Paragraph>` : ''}
<Button href="${escapeXml(postUrl)}" align="center" bgColor="#000000" textColor="#ffffff">
  Read the full post
</Button>`;

    // 7. Update the email message with content
    const updateRes = await fetch(
      `https://app.loops.so/api/v1/email-messages/${emailMessageId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expectedRevisionId: emailMessageContentRevisionId,
          subject: `New post: ${postTitle}`,
          previewText: postExcerpt || postTitle,
          fromName: 'Vijay',
          fromEmail: 'hello',
          lmx: lmxContent,
        }),
      }
    );

    if (!updateRes.ok) {
      console.error('Failed to update campaign content:', updateRes.status, await updateRes.text());
      return new Response('Failed to update campaign content', { status: 502 });
    }

    return new Response('Draft campaign created — review and send in Loops', {
      status: 200,
    });
  } catch (err) {
    console.error('Error creating Loops campaign:', err);
    return new Response('Internal error', { status: 500 });
  }
}