import PublicProfile from '../../../../views/PublicProfile';

export default async function ProfilePage({ params }) {
  const { id } = await params;
  return <PublicProfile userId={id} />;
}
