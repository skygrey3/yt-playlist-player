import PlaylistInput from "../components/PlaylistInput";
import PlayerContainer from "../components/PlayerContainer";
import PageTitle from "../components/PageTitle";
import ShareButton from "../components/ShareButton";

export default function Home() {
  return (
    <div>
      <PageTitle />
      <PlaylistInput />  
      <ShareButton />
      <div >
        <PlayerContainer />
      </div>
    </div>
  );
}
