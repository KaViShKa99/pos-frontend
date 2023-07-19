import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";

const theme = createTheme({
  palette: {
    primary: {
      // main: "#FFA500",
      main: "#ff6d32",
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar({ notification }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const token = localStorage.getItem("token");
  const [arr, setArr] = useState([notification]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  // const [isNotificationMenuOpen, setNotificationMenuOpen] = useState(null);

  const isNotificationMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    // if(arr.length > 0){
    setArr(notification);
    // }
  }, [notification]);

  const handleNotficationMenuOpen = (event) => {
    // setNotificationMenuOpen(Boolean(event.currentTarget));
    notification && setAnchorEl(event.currentTarget);
  };
  const handleSalsemangerView = () => {
    navigate("/sales-manager-home");
  };
  const handleHomeView = () => {
    navigate("/");
  };

  const handleCloseNotifications = (id) => {
    // setAnchorEl(null);
    const storedNotification = localStorage.getItem("notification");
    const parsedNotification = JSON.parse(storedNotification);
    parsedNotification.splice(id, 1);
    arr.splice(id, 1);
    setArr([...arr]);
    localStorage.setItem("notification", JSON.stringify(parsedNotification));

    // console.log(" ", parsedNotification);
  };

  const handleProfileMenuOpen = (event) => {
    // setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // localStorage.removeItem('notification')
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // const menuId = "primary-search-account-menu";
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );
  const openNotificationMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      // id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={isNotificationMenuOpen}
      onClose={handleMenuClose}
    >
      <div
        className="notification-list"
        style={{
          width: "400px",
          borderRadius: "4px",
          backgroundColor: "#fff",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            marginBottom: "16px",
            textAlign: "center",
            fontWeight: "lighter",
          }}
        >
          Notifications
        </h2>

        {notification &&
          arr.map((notify, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  backgroundColor: "#f3f7ff",
                  borderRadius: "4px",
                }}
              >
                <div>{notify}</div>
                <button
                  onClick={() => handleCloseNotifications(i)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#aaa",
                    fontSize: "25px",
                  }}
                >
                  x
                </button>
              </div>
            </div>
          ))}

        {arr?.length === 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                backgroundColor: "#f3f7ff",
                borderRadius: "4px",
              }}
            >
              <div>Not Found</div>
            </div>
          </div>
        )}

        <button
          onClick={handleMenuClose}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Close
        </button>
      </div>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 15 new notifications"
          color="inherit"
          onClick={handleNotficationMenuOpen}
        >
          <Badge badgeContent={15} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      {/* <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem> */}
    </Menu>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, color: "white" }}
            >
              POS
            </Typography>

            <Box
              component="img"
              sx={{
                height: 64,
              }}
              alt="Your logo."
              src={Logo}
            />
            {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {token === "admin" && currentPath === "/" && (
                <span
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#4CAF50",
                    border: "none",
                    color: "white",
                    padding: "10px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "10px",
                    cursor: "pointer",
                    width: "200px",
                  }}
                  onClick={handleSalsemangerView}
                >
                  Go to Sales Manager
                </span>
              )}

              {token === "admin" && currentPath !== "/" && (
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "20px",
                    backgroundColor: "#4CAF50",
                    border: "none",
                    color: "white",
                    padding: "10px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "10px",
                    cursor: "pointer",
                    width: "200px",
                  }}
                  onClick={handleHomeView}
                >
                  Go to Home
                </span>
              )}

              <IconButton
                size="large"
                aria-label="show 15 new notifications"
                color="inherit"
                onClick={handleNotficationMenuOpen}
              >
                {arr && (
                  <Badge badgeContent={arr.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                )}
                {!notification && <NotificationsIcon />}
              </IconButton>

              {/* <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {/* {renderMenu} */}
        {notification && openNotificationMenu}
      </Box>
    </ThemeProvider>
  );
}
