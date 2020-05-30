module.exports.express_callback = (controller) => {
  return (req, res) => {
    try{
      controller(req)
        .then( (response) => {
          if ( response.headers ){
            res.set(response.headers);
          }
          res.status(response.statusCode === undefined ? 200 : response.statusCode).json(response.body)
        })
        .catch( (err) => {
          res.status(400).json({isError: true, body: err})
        })
    } catch(e) {
      res.status(500).json({isError: true, msg: "Internal Server Error"})
    }
  }
}
