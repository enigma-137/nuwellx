import Link from 'next/link'
import path from 'path'
import fs from 'fs/promises'

async function getBlogPosts() {
  const files = await fs.readdir(path.join(process.cwd(), 'app/blog/articles'))
  return files.map(filename => ({
    slug: filename.replace('.mdx', ''),
    title: filename.replace('.mdx', '').split('-').join(' ')
  }))
}

export default async function BlogIndex() {
  const posts = await getBlogPosts()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}