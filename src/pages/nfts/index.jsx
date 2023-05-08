import styled from "styled-components";
import Intro from "./screens/intro";
import Carousel from "./screens/carousel";
const NFTs = () => {
	return (
		<Container>
            <Intro />
			<Carouselholder>
				<Carousel />
			</Carouselholder>
		</Container>
	);
};
const Container = styled.div`
  
`;
const Carouselholder= styled.div`
  max-width: 1300px;
  margin: auto;
  margin-top: 4rem;
`;
export default NFTs;