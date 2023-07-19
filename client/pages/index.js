const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are Signed In</h1>
  ) : (
    <h1>You are NOT Signed In</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
