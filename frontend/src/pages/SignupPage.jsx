import { useSearchParams } from 'react-router-dom';
import SignupMain from '../components/signup/SignupMain';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  return <SignupMain role={role} />;
};

export default SignupPage;

