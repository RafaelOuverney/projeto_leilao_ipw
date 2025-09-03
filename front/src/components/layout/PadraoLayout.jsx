import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const PadraoLayout = ({ children }) => {

    return (
        <>
            <Header />
            <main className="App-main">
                {children}
            </main>
            <Footer />
        </>
    );
}
export default PadraoLayout;