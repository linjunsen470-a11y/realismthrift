import { defineDocuments, defineLocations } from "sanity/presentation";

export const postLocations = defineLocations({
  select: {
    title: "title",
    slug: "slug.current",
  },
  resolve: (post) => {
    if (!post?.slug) {
      return {
        message: "This post needs a slug before it can be previewed.",
        tone: "caution",
      };
    }

    return {
      locations: [
        {
          title: post.title || "Untitled post",
          href: `/blog/${post.slug}`,
        },
        {
          title: "Blog index",
          href: "/blog",
        },
      ],
    };
  },
});

export const mainDocuments = defineDocuments([
  {
    route: "/blog/:slug",
    filter: `_type == "post" && slug.current == $slug`,
    params: ({ params }) => ({
      slug: params.slug,
    }),
  },
]);
