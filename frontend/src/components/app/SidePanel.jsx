import Card, { CardHeader, CardTitle, CardContent } from '../common/Card.jsx';

function SidePanel({ title, children }) {
  return (
    <Card>
      {title ? (
        <CardHeader style={{ paddingBottom: '0.5rem' }}>
          <CardTitle style={{ fontSize: '1rem' }}>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent style={title ? { paddingTop: '0.5rem' } : undefined}>
        {children}
      </CardContent>
    </Card>
  );
}

export default SidePanel;
