import styles from './header.module.scss'

export  function Header() {
  return (
    <header className={styles.headerContainer}>
      <img src="imagens/Logo.svg" alt="logo" />
    </header>
  )
}
