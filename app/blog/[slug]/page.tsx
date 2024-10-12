import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import path from 'path'
import fs from 'fs/promises'

const components = {
  img: (props: any) => (
    <div className="my-4">
      <Image
        {...props}
        width={800}
        height={400}
        className="rounded-lg"
        alt={props.alt || 'Blog post image'}
      />
    </div>
  ),
}

export async function generateStaticParams() {
  const files = await fs.readdir(path.join(process.cwd(), 'app/blog/articles'))
  return files.map(filename => ({
    slug: filename.replace('.mdx', '')
  }))
}

async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'app/blog/articles', `${slug}.mdx`)
  try {
    const source = await fs.readFile(filePath, 'utf8')
    return source
  } catch (error) {
    notFound()
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const source = await getPost(params.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-sm sm:prose-base lg:prose-lg mx-auto">
        <MDXRemote source={source} components={components} />
      </article>
    </div>
  )
}