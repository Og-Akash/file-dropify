import SignUpForm from "@/components/auth/SignUpForm";

export default function SignInPage() {
  return (
    <div className="h-screen flex flex-col justify-between items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Use the unified Navbar component */}
      {/* <Navbar /> */}

      <main className="flex-1 flex justify-center items-center p-6">
        <SignUpForm />
      </main>

      {/* Dark mode footer */}
      <footer className="bg-background text-foreground-50 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} File-Dropify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}