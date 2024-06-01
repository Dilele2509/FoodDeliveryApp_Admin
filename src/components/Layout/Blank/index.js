function Blank({children}) {
    return ( 
        <div style={{ display: "block" , height:'100%'}}>
            <div className="body-container blank">
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
     );
}

export default Blank;