import Divider from "./Divider";

export default function Footer() {
  return (
    <footer>
      <div className="mt-12 flex flex-col items-center">
        <div className="mb-2 flex space-x-2 text-sm">
          <div>Frommm???</div>
          <div>{" • "}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
        </div>
      </div>
    </footer>
  );
}
