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

// Strips basic markdown syntax down to plain text, then truncates
function markdownToPlainExcerpt(markdown: string, maxLength = 220): string {
  if (!markdown) return '';

  const plain = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links -> link text only
    .replace(/[#>*_`~-]/g, '') // markdown symbols
    .replace(/\n+/g, ' ') // collapse newlines
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + '…';
}

async function uploadImageToLoops(imageUrl: string): Promise<string | null> {
  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      console.error('Failed to fetch source image:', imageRes.status);
      return null;
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    const imageArrayBuffer = await imageRes.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);

    const createRes = await fetch('https://app.loops.so/api/v1/uploads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType,
        contentLength: imageBytes.byteLength,
      }),
    });

    if (!createRes.ok) {
      console.error('Failed to create Loops upload:', createRes.status, await createRes.text());
      return null;
    }

    const { emailAssetId, presignedUrl } = await createRes.json();

    const putRes = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(imageBytes.byteLength),
      },
      body: imageBytes,
    });

    if (!putRes.ok) {
      console.error('Failed to PUT image to presigned URL:', putRes.status);
      return null;
    }

    const completeRes = await fetch(
      `https://app.loops.so/api/v1/uploads/${emailAssetId}/complete`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}` },
      }
    );

    if (!completeRes.ok) {
      console.error('Failed to complete Loops upload:', completeRes.status, await completeRes.text());
      return null;
    }

    const { finalUrl } = await completeRes.json();
    return finalUrl ?? null;
  } catch (err) {
    console.error('Error uploading image to Loops:', err);
    return null;
  }
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = await req.json();

  if (payload.event !== 'entry.publish' || payload.model !== 'blog') {
    return new Response('Ignored', { status: 200 });
  }

  let entry = payload.entry;

  const needsRefetch = !entry.thumbnail?.url && !entry.metadata?.description;

  if (needsRefetch && entry.id) {
    try {
      const refetchRes = await fetch(
        `${STRAPI_BASE_URL}/api/posts/${entry.id}?populate=thumbnail&populate=metadata.image`,
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

  const postTitle: string = entry.title ?? 'New post';
  const postSlug: string = entry.slug;
  const postExcerpt: string = entry.metadata?.description ?? '';
  const postUrl = `${SITE_URL}/posts/${postSlug}`;

  const contentSnippet = markdownToPlainExcerpt(entry.content ?? '');

  const rawThumbnailUrl = entry.thumbnail?.url ?? entry.metadata?.image?.url ?? '';
  const strapiCoverImageUrl = resolveMediaUrl(rawThumbnailUrl);

  const coverImageUrl = strapiCoverImageUrl
    ? await uploadImageToLoops(strapiCoverImageUrl)
    : null;

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
      const errBody = await createRes.text();
      console.error('Failed to create campaign:', createRes.status, errBody);
      return new Response('Failed to create campaign', { status: 502 });
    }

    const { emailMessageId, emailMessageContentRevisionId } = await createRes.json();

    const lmxContent = `
<Style />
${
  coverImageUrl
    ? `<Image src="${escapeXml(coverImageUrl)}" alt="${escapeXml(postTitle)}" width="560" align="center" borderRadius="12" />`
    : ''
}
<H1 align="center">${escapeXml(postTitle)}</H1>
${postExcerpt ? `<Paragraph align="center">${escapeXml(postExcerpt)}</Paragraph>` : ''}
${
  contentSnippet
    ? `<Section blockColor="#F8FAFC" blockBorderRadius="12" paddingTop="16" paddingBottom="16" paddingLeft="16" paddingRight="16">
  <Paragraph>${escapeXml(contentSnippet)}</Paragraph>
</Section>`
    : ''
}
<Button href="${escapeXml(postUrl)}" align="center" bgColor="#000000" textColor="#ffffff">
  Read the full post
</Button>
<Divider />
<Section blockColor="#F8FAFC" blockBorderRadius="12" paddingTop="20" paddingBottom="20" paddingLeft="20" paddingRight="20">
  <H3 align="center">Vijay Prakash</H3>
  <Paragraph align="center">Software Engineer · Writing about backend systems, distributed architecture, and full-stack engineering.</Paragraph>
  <Paragraph align="center"><Link href="${escapeXml(SITE_URL ?? '')}">vijayprakash.co.in</Link></Paragraph>
</Section>`;

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
      const errBody = await updateRes.text();
      console.error('Failed to update campaign content:', updateRes.status, errBody);
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