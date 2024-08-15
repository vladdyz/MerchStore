import PostTable from '@/components/ProductDetails'
import withAuth from '@/components/auth';


function Products() {
    return (
      
      <>
      <PostTable />
      </>
    );
  }

  export default withAuth(Products);