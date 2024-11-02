import { toast } from 'react-toastify';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
    const Navbar = () => {
      const handleLogout = () => {
        toast.info('Logged out successfully!');
        // Perform logout logic
      };
    return (
      <AppBar position="static" className=" bg-transparent shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
        <Toolbar className="flex justify-between">
          <Typography variant="h6" className="text-white font-bold">
            School Dashboard
          </Typography>
          <Button className="text-white hover:bg-white hover:text-black px-4 py-2 rounded transition duration-300 ease-in-out">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;
  