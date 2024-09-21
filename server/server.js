const server = require("http").createServer();
const io = require("socket.io")(
    server,
    {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    }
)

let totalPlayersJoined = 0;
let totalCheckboxesChecked = new Set()
const PORT = 3000;

  
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

io.on("connection", (socket) => {
    console.log("A new user has connected", socket.id);
    totalPlayersJoined++;

    io.emit("ready", {
        totalChecked: Array.from(totalCheckboxesChecked),
        playersJoined: totalPlayersJoined,
    })

    socket.on("disconnect", () => {
        totalPlayersJoined--;
        io.emit("ready", {
            totalChecked: totalCheckboxesChecked,
            playersJoined: totalPlayersJoined,
        });
    });
    socket.on("checked", (data) => {
        const checkedSet = new Set(data);
        totalCheckboxesChecked = checkedSet;
        console.log('totalCheckboxesChecked', totalCheckboxesChecked)
        socket.broadcast.emit("checked", Array.from(totalCheckboxesChecked))
    })

})
