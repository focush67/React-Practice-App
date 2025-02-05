self.addEventListener("push",function(e){
    const data = e.data.json();
    self.registration.showNotification(data.title,{
        body: data.body,
        icon:"/alchemy.svg",
        badge:"/alchemy.svg",
        vibrate:[200,100,200],
    });
});

