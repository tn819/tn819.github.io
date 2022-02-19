import type { NextPage } from 'next'
import Link from '../src/Link'
import ProTip from '../src/ProTip'
import Copyright from '../src/Copyright'
import Page from '../src/Page'

const Home: NextPage = () => {
  return (
    <Page title="Thomas Neil Personal Site">
      <Link href="/about" color="secondary">
        Go to the about page
      </Link>
      <ProTip />
      <Copyright />
    </Page>
  )
}

export default Home
