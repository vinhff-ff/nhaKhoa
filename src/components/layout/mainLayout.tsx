import Footer from "./Footer";
import HeaderCustom from "./Header";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="layout-main">
      <div className="layout-main__header">
        <HeaderCustom />
      </div>

      <main className="layout-main__content">
        {children}
      </main>

      <div className="layout-main__footer">
        <Footer/>
      </div>
    </div>
  );
};

export default MainLayout;
