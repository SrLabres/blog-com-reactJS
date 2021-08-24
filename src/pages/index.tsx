import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link'


interface Post {
  uid: string;
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
  
  const [posts, setPosts] = useState(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
 async function carregarMaisPosts(){
    const req = await fetch(nextPage)
    .then(function(response) {
      return response.json()
  })

  setNextPage(req.next_page)
  setPosts([
    ...posts,
    ...req.results,
  ])
}

  return (
    <>
      <main className={commonStyles.container}>
          <ul className={styles.postsList}>
            { posts.map((post) => (
              <li key={post.data.title}>
                <Link href={`/post/${post.uid}`}>
                <a>
                  <h2>{ post.data.title }</h2>
                  <p>{ post.data.subtitle}</p>
                  <span><FiCalendar /> { format(new Date(post.first_publication_date), 'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  ) }</span><span><FiUser /> { post.data.author }</span>
                </a>
                </Link>
              </li>
            ))}
            {nextPage != null ? <a onClick={() => carregarMaisPosts()}href="#">Carregar mais posts</a> : ''}
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
        pageSize: 3,
      }
    );
      
    const results = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
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
