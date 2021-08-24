import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router'


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
  const router = useRouter()

  if (router.isFallback) {
    return (
      <main>
        <div>Carregando...</div>
      </main>
    )
  }
  function tempoDeLeitura() {
    const redu = post.data.content.reduce((acumulador, valoratual) => {
      const text = RichText.asText(valoratual.body).split(/\s/)
      return acumulador + text.length
    }, 0)

    return Math.ceil(redu / 200)
  }
  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>
      <main >
        
        <img src={post.data.banner.url} alt={post.data.title} className={styles.banner}/>
        <article className={commonStyles.container}>
          <div className={styles.article}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
          <span><FiCalendar /> { format(new Date(post.first_publication_date), 'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  ) }</span><span><FiUser /> { post.data.author }</span>
                  <span>{tempoDeLeitura()} min</span>
          </div>
          {post.data.content.map(content => (
            <div key={content.heading} className={styles.section}>
              <h2>{content.heading}</h2>
              <p>
                { RichText.asText(content.body) }
              </p>
            </div>
          ))}
          </div>
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

  const paths = []

  return {
    paths,
    fallback: true,
  };
};

 export const getStaticProps: GetStaticProps = async ({params}) => {
   const prismic = getPrismicClient();
   const { slug } = params;
   const response = await prismic.getByUID('posts', String(slug), {});
    
   

   const post =  {
     uid: response.uid,
     first_publication_date: response.first_publication_date,
     data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
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
