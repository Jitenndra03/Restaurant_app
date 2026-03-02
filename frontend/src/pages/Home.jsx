/**
 * Home - Landing page composing Hero, Menus, Testimonial and NewsLetter sections.
 */
import Hero from "../components/Hero";
import Menus from "../components/Menus";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div>
      <Hero />
      <Menus />
      <Testimonial />
      <NewsLetter />
    </div>
  );
};

export default Home;
