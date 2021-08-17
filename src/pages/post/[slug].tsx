import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

 export default function Post({post}: PostProps) {

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>
      <main>
        <img src={post.data.banner.url} alt={post.data.title} />
        <article>
          <h1>{post.data.title}</h1>

          {post.data.content.map(content => (
            <article>
              <h2>{content.heading}</h2>
              <p>
                { content.body[0].text }
              </p>
            </article>
          ))}
        </article>
      </main>
    </>
  )
 }

 export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

 export const getStaticProps: GetStaticProps = async ({params}) => {
   const prismic = getPrismicClient();
   const { slug } = params;
   const response = await prismic.getByUID('posts', String(slug), {});
    
   

   const post =  {
     first_publication_date: response.first_publication_date,
     data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content
     }
   }

   return {
     props: {
       post,
     },

     redirect: 60 * 60,
   }
 };
