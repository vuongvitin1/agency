import React, { useState } from 'react';
import {
    Avatar,
    MenuItem, Menu, ListItemIcon, ListItemText, Fade, Divider,
    Box, ClickAwayListener, Grow, IconButton, List, ListItem, MenuList, Paper, Popover, Popper, Typography
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export function MenuLanguage({ classes, onChangeLanguage = () => { } }) {
    const [open, setOpen] = useState(false);
    const flag = null //localStorage.getItem('i18nextLng') === 'vn' ? FlagVietnamIcon : FlagAmericaIcon
    const [currentFlag, setCurrentFlag] = useState(flag);
    const anchorRef = React.useRef(null);

    const handleToggle_click = () => {
        setOpen((preOpen) => !preOpen);
    };
    const handleClose_click = (event) => {
        if (event && anchorRef.current && anchorRef.current.contains(event.targer)) {
            return;
        }
        setOpen(false);
    };
    const handleListKeyDown_click = (event) => {
        if (event.key === 'tab') {
            event.preventDefault();
            setOpen(false);
        }
    }
    const handleChangeLang_click = (lang) => {
        setCurrentFlag(lang.icon);
        handleClose_click();
        onChangeLanguage(lang);
    };

    return (
        <Box className={classes.rootLangMenu}>
            <IconButton onClick={handleToggle_click} ref={anchorRef} color="default" >
                <Avatar className="lang-icon" variant="rounded" src={currentFlag} />
            </IconButton>
            <Popover open={open} anchorEl={anchorRef.current} transition disablePortal className={classes.langPopover}>
                {({ transitionProps, placement }) => (
                    <Grow {...transitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                        <Box>
                            <ClickAwayListener onClickAway={handleClose_click}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown_click} className={classes.langMenuList}>
                                    {/* {MENU_LANGUAGE.map((itm, idx) => {
                                        return (
                                            <MenuItem key={idx} onClick={() => handleChangeLang_click(itm)}>
                                                <Avatar className="lang-icon" src={itm.icon}></Avatar>
                                            </MenuItem>
                                        );
                                    })} */}
                                </MenuList>
                            </ClickAwayListener>
                        </Box>
                    </Grow>
                )}
            </Popover>
        </Box>
    );
}

export function ProfileMenu({ classes, transition, anchorEl, onClose, logout }) {
    const handle_close = (route) => {
        onClose(route);
    };

    return (
        <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            keepMounted
            TransitionComponent={Fade}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={() => handle_close()}
            className={classes.rootProfileMenu}
        >
            <MenuItem className="display-name">
                <ListItemIcon className="item-icon">
                    <Avatar className="avatar-icon" />
                </ListItemIcon>
                <ListItemText primary="Adminstration" className="item-text" />
            </MenuItem>
            <Divider />

            {/* {Object.values(ProfileRoutes).map((route, idx) => {
                return (
                    <div key={idx}>
                        <MenuItem onClick={() => handle_close(route)} className="menu-item">
                            <ListItemIcon className="item-icon">
                                <route.icon color={route.color || 'primary'} />
                            </ListItemIcon>
                            <ListItemText primary={t(route.label)} className="item-text" />
                        </MenuItem>
                        <Divider />
                    </div>
                )
            })} */}

            <MenuItem onClick={logout} className="menu-item">
                <ListItemIcon className="item-icon">
                    <ExitToAppIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={'SignOut'} className="item-text" />
            </MenuItem>
        </Menu>
    );
}
