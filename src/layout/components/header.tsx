const Header = () => {
  return (
    <div className="flex items-center justify-between w-full text-white">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      <div className="flex gap-4">
        {/* User profile or other actions can go here */}
        <span>Admin User</span>
      </div>
    </div>
  )
}

export default Header
