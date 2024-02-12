import pool from "../models/db"
//dont forget to import pool
//create comments
const CreateComments=(req,res)=>{
 //endpoint and method (post,/CreateComment)
const user_id=req.token.userId;
const post_id=req.query.id;
 //we want to create comment in req.body
  const {comment}=req.body;
pool.query(`INSERT INTO comments(user_id,post_id,comment)VALUES($1,$2,$3) RETURNING *`,[user_id,post_id,comment]).then((result)=>{
    res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        results: result.rows[0],
      });
}).catch((err)=>{
    res.status(404).json({
        success: false,
        message: 'Server error',
        err: err.message,
      });
})
}
 const getComments=(req,res)=>{
    const userId = req.token.userId
    //console.log(req.token.userId);
    pool.query(`  SELECT * FROM comments
  WHERE is_deleted = 0  `,[userId]).then((result)=>{
    return res.status(200).json({
      success: true,
      message: 'All the comments',
      articles:result.rows
    });
  }).catch((err)=>{
    return res.status(500).json({
      success: false,
      message: 'Server error',
      err: err.message
    });
  })
}
 const UpdateComments=(req,res)=>{
  const post_Id = req.params.id;
  const{comment}=req.body
  const data = [comment, post_Id];
  pool.query(`UPDATE Comments SET Comment = COALESCE($1)  WHERE id=$3 AND is_deleted = 0  RETURNING *;`,data).then((result)=>{
    if(result.rows.length !== 0){
      return res.status(200).json({
        success: true,
        article: result.rows[0]
      });
    }else {
      throw new Error("Error happened while updating article");

    }
    
  }).catch((err)=>{
    return res.status(500).json({
      success: false,
      message: 'Server error',
      err: err.message
    });
  })
}
/*
const DeleteComments=(req,res)=>{
    
}
const getCommentsById=(req,res)=>{
    const userId = req.params.id;
    pool.query(`SELECT user_id,post_id,comment, FROM users INNER JOIN comments ON users.id=comments.user_id WHERE comments.id=$1 AND comments.is_deleted=0;
`,[userId]).then((result)=>{
  if (result.rows.length !== 0) {
    return res.status(200).json({
        success: true,
      message: `The comment with id: ${userId}`,
      comment: result.rows
    });
  }else {
    throw new Error("Error happened while getting article");
  }
}).catch((err)=>{
  return res.status(500).json({
    success: false,
    message: 'Server error',
    err: err.message
  });
})
}
const UpdateCommentsById=(req,res)=>{

}
const DeleteCommentsById=(req,res)=>{
    
}  */

module.exports={
    CreateComments,DeleteComments,DeleteCommentsById,UpdateCommentsById,getComments,UpdateComments,getCommentsById
} 