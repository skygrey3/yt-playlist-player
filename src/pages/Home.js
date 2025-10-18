import PlaylistInput from "../components/PlaylistInput";
import PlayerContainer from "../components/PlayerContainer";
import PageTitle from "../components/PageTitle";

export default function Home() {
  return (
    <div>
      <PageTitle />
      <PlaylistInput />  
      <div >
        <PlayerContainer />
      </div>
    </div>
  );
}
