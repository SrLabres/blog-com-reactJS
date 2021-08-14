import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home({ postsPagination }: HomeProps) {
  
  return (
    <>
      <main className={commonStyles.container}>
          <ul className={styles.postsList}>
            { postsPagination.results.map((post) => (
              <li key={post.uid}>
                <h2>{ post.data.title }</h2>
                <p>{ post.data.subtitle}</p>
                <span><FiCalendar /> { post.first_publication_date }</span><span><FiUser /> { post.data.author }</span>
              </li>
            ))}
            

            

            <a href="#">Carregar mais posts</a>
          </ul>
      </main>
    </>
  )

 }

 export const getStaticProps = async () => {
  const prismic = getPrismicClient();
    const postsResponse = await prismic.query([
      Prismic.predicates.at('document.type', 'posts')
    ],
      {
        fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
        pageSize: 5,
      }
    );
      
    const results = postsResponse.results.map(post => {
      return {
        slug: post.uid,
        first_publication_date: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    })

    const next_page = postsResponse.next_page;
    return {
      props: {
        postsPagination: {
          next_page,
          results
        }
      }
    }

 };
