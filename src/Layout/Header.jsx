import * as React from 'react';
import { AppBar, Toolbar, Container } from '@mui/material';

import logo from './logo.png';

function Header() {
    return (
        <AppBar position="static" id="header">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <img src={logo} id="idea-theorem-header-logo" alt="Idea Theorem Header Logo" />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
