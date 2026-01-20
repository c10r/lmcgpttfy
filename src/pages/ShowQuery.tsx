import { useParams } from "react-router-dom";
import { MockChatInterface } from "@/components/MockChatInterface";

const ShowQuery = () => {
  const { query } = useParams<{ query: string }>();
  const decodedQuery = query ? decodeURIComponent(query) : "";

  const handleComplete = () => {
    // Redirect happens inside MockChatInterface
  };

  if (!decodedQuery) {
    return (
      <div className="min-h-screen chat-container flex items-center justify-center">
        <p className="text-muted-foreground">No query provided</p>
      </div>
    );
  }

  return <MockChatInterface query={decodedQuery} onComplete={handleComplete} />;
};

export default ShowQuery;
