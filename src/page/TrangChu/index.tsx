import Slide5 from "./silde5";
import Slide1 from "./slide1";
import Slide3 from "./slide3";
import Slide4 from "./slide4";
import PopupAd from "../../components/custom/PopupAd";

const HomePage = () => {
    return (
        <div>
            <PopupAd />
            <Slide1/>
            <Slide3/>
            <Slide4/>
            <Slide5/>
        </div>
    );
};

export default HomePage;