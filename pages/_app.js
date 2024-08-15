//used to initialize all pages
//each page will contain a navbar imported from layout
import Layout from '@/components/layout';
import "@/styles/globals.css";


//render the individual components
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;