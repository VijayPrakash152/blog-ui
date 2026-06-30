// app/api/webhooks/strapi-publish/route.ts

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

// Paste the finalUrl from the one-off upload script here
const PROFILE_PHOTO_LOOPS_URL = 'https://images.vialoops.com/cmqujuuuw0tyh0j1ry1saprls/cmr0ckiw109z30j4jaq954bj0.jpg';

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

function markdownToPlainExcerpt(markdown: string, maxLength = 600): string {
  if (!markdown) return '';

  const plain = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= maxLength) return plain;

  // Try to cut at the last full sentence within the limit, not mid-word
  const truncated = plain.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  if (lastPeriod > maxLength * 0.6) {
    return truncated.slice(0, lastPeriod + 1);
  }
  return truncated.trim() + '…';
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
<H1 align="center" paddingTop="24">${escapeXml(postTitle)}</H1>
${postExcerpt ? `<Paragraph align="center" fontSize="16" paddingBottom="8">${escapeXml(postExcerpt)}</Paragraph>` : ''}
${
  contentSnippet
    ? `<Section blockColor="#F8FAFC" blockBorderRadius="12" paddingTop="20" paddingBottom="20" paddingLeft="20" paddingRight="20">
  <Paragraph fontSize="15" lineHeight="160">${escapeXml(contentSnippet)}</Paragraph>
</Section>`
    : ''
}
<Button href="${escapeXml(postUrl)}" align="center" bgColor="#000000" textColor="#ffffff" paddingTop="24" paddingBottom="24">
  Read the full post
</Button>
<Divider paddingTop="8" paddingBottom="8" />
<Section blockColor="#F8FAFC" blockBorderRadius="12" paddingTop="24" paddingBottom="24" paddingLeft="24" paddingRight="24">
  <Columns gap="16" widths="30,70" verticalAlignment="middle">
    <ColumnItem>
      <Image src="${escapeXml(PROFILE_PHOTO_LOOPS_URL)}" alt="Vijay Prakash" width="80" align="center" borderRadius="40" />
    </ColumnItem>
    <ColumnItem>
      <H3>Vijay Prakash</H3>
      <Paragraph fontSize="14">Software Engineer · Writing about backend systems, distributed architecture, and full-stack engineering.</Paragraph>
      <Paragraph fontSize="14"><Link href="${escapeXml(SITE_URL ?? '')}">vijayprakash.co.in</Link></Paragraph>
    </ColumnItem>
  </Columns>
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