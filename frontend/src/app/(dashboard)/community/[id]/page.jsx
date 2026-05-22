import CommunityDetail from '../../../../views/CommunityDetail';

export default async function CommunityPage({ params }) {
  const { id } = await params;
  return <CommunityDetail communityId={id} />;
}
