import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

 export default function Home() {
   
  return (
    <>
      <main className={commonStyles.container}>
          <ul className={styles.postsList}>
            <li>
              <h2>Como utilizar Hooks</h2>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <span><FiCalendar /> 15 Mar 2021</span><span><FiUser /> Joseph Oliveira</span>
            </li>

            <li>
              <h2>Como utilizar Hooks</h2>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <span><FiCalendar /> 15 Mar 2021</span><span><FiUser /> Joseph Oliveira</span>
            </li>

            <li>
              <h2>Como utilizar Hooks</h2>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <span><FiCalendar /> 15 Mar 2021</span><span><FiUser /> Joseph Oliveira</span>
            </li>

            <li>
              <h2>Como utilizar Hooks</h2>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <span><FiCalendar /> 15 Mar 2021</span><span><FiUser /> Joseph Oliveira</span>
            </li>

            <li>
              <h2>Como utilizar Hooks</h2>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <span><FiCalendar /> 15 Mar 2021</span><span><FiUser /> Joseph Oliveira</span>
            </li>

            <a href="#">Carregar mais posts</a>
          </ul>
      </main>
    </>
  )

 }

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
