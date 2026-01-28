import Select from "../components/Select";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">About Us</h1>
      <p className="text-gray-700">This is the about page. Learn more about our application here.</p>
      <div className="mt-6">
        <Select />
      </div>
    </div>
  );
}
