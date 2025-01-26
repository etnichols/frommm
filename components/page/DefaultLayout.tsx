import styles from "@components/page/DefaultLayout.module.scss";

interface DefaultLayoutProps {
  previewPixelSRC: string;
  children?: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  previewPixelSRC,
  children,
}) => {
  return (
    <div className={styles.body}>
      <img className={styles.pixel} src={previewPixelSRC} alt="" />
      {children}
    </div>
  );
};

export default DefaultLayout;
