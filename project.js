(()=>{
    const init=()=>{
        self.buildHTML();
        self.buildCSS();
        self.setEvents();
    }

    const buildHTML=()=>{
        const html=`
            <div class="container">
                <h1></h1>
            </div>
        `;

        $('.product-detail').append(html);
    }



    init();

})