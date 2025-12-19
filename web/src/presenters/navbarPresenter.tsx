import { useState } from "react";
import { NavbarView } from "../views/navbarView";

export function NavbarPresenter() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <NavbarView isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    );
}
