app.factory("ConfirmedOrderService",function(){
    let orderList=[];
    const STORAGE_KEY = "confirmedOrders";
    return{
        setOrders:function(orders){
            localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        },
        getOrders:function(){
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        },

        clearOrders: function() {
            localStorage.removeItem(STORAGE_KEY);
        }
    };
})