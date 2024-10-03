const { send } = require("express/lib/response");
const {
  getPrivateUserById,
  updateUserInfoModel,
  getUserByPhoneNumber,
  getUserById,
} = require("../auth/model");
const {
  insertNotification,
  fetchNotificationByUUID,
  fetchNotificationById,
} = require("./t-model");

let sendMoneyController = (req, res) => {
  let { amount, receiver, sender } = req.body;
  getPrivateUserById(sender).then((response1) => {
    if (response1.error) {
      return res.send({
        success: false,
        message: response1.error.message,
        data: null,
      });
    }
    // check if the UUID exists
    if (response1.data.length < 1) {
      return res.send({
        success: false,
        message: "Invalid User Id",
        data: null,
      });
    }
    //get the receiver
    getPrivateUserById(receiver).then((response2) => {
      if (response2.error) {
        return res.send({
          success: false,
          message: response1.error.message,
          data: null,
        });
      }
      // check if the UUID exists
      if (response2.data.length < 1) {
        return res.send({
          success: false,
          message: "Invalid User Id",
          data: null,
        });
      }

      // declare two variables
      let senderData = response1.data.user.user_metadata;
      let receiverData = response2.data.user.user_metadata;

      //check if the sender has enough money
      if (senderData.wallet < amount) {
        return res.send({
          success: false,
          message: "Insufficient Funds",
          data: null,
        });
      }

      let senderNewWalletBalance = senderData.wallet - amount;
      let receiverNewWalletBalance = receiverData.wallet + parseInt(amount);

      // update sender data
      let senderNewData = {
        wallet: senderNewWalletBalance,
      };

      // update receiver data
      let receiverNewData = {
        wallet: receiverNewWalletBalance,
      };

      // updating sender info

      updateUserInfoModel({ UUID: sender, data: senderNewData })
        .then((response3) => {
          if (response3.error) {
            return res.send({
              success: false,
              message: response3.error.message,
              data: null,
            });
          }
          // updating receiver info

          updateUserInfoModel({ UUID: receiver, data: receiverNewData })
            .then((response4) => {
              if (response4.error) {
                return res.send({
                  success: false,
                  message: response4.error.message,
                  data: null,
                });
              }

              getUserById(sender).then((nameResponse) => {
                if (nameResponse.error) {
                  return res.send({
                    success: false,
                    message: nameResponse.error.message,
                    data: null,
                  });
                }
                let senderName = nameResponse.data[0].name;

                let payload = {
                  from: sender,
                  to: receiver,
                  type: "CASH TRANSFER",
                  msg: `You have received N${amount} from ${senderName}`,
                  data: { amount, walletBalance: receiverNewWalletBalance },
                };
                insertNotification(payload)
                  .then((response5) => {
                    if (response5.error) {
                      return res.send({
                        success: false,
                        message: response5.error.message,
                        data: null,
                      });
                    }

                    res.send({
                      success: true,
                      message: "You have received money!",
                      data: null,
                    });
                  })
                  .catch((error) => {
                    return res.send({
                      success: false,
                      message: "a server occured",
                      data: null,
                    });
                  });
              });
            })

            //creating notification record
            .catch((error) => {
              return res.send({
                success: false,
                message: "a server occured",
                data: null,
              });
            });
        })
        .catch((error) => {
          return res.send({
            success: false,
            message: "a server occured",
            data: null,
          });
        });

      // res.send({ senderData, receiverData });
    });
  });
};

const addMoneyController = (req, res) => {
  let { user, amount2 } = req.body;

  getPrivateUserById(user)
    .then((response1) => {
      if (response1.error) {
        return res.send({
          success: false,
          message: response1.error.message,
          data: null,
        });
      }

      // check if the UUID exists
      if (response1.data.length < 1) {
        return res.send({
          success: false,
          message: "Invalid sender id",
          data: null,
        });
      }

      let userData = response1.data.user.user_metadata;

      let userNewWalletBalance = userData.wallet + parseInt(amount2);
      let userNewData = { wallet: userNewWalletBalance };

      updateUserInfoModel({ UUID: user, data: userNewData }).then(
        (response4) => {
          if (response4.error) {
            return res.send({
              success: false,
              message: response4.error.message,
              data: null,
            });
          }

          let payload = {
            from: "Finaz",
            to: user,
            type: "CASH DEPOSIT",
            msg: `You have added N${amount2} to your wallet!`,
            data: { amount2, walletBalance: userNewWalletBalance },
          };

          insertNotification(payload).then((response6) => {
            if (response6.error) {
              return res.send({
                success: false,
                message: response6.error.message,
                data: null,
              });
            }

            res.send({
              success: true,
              message: `You have added N${amount2} to your wallet!`,
              data: null,
            });
          });
        }
      );
    })
    .catch((error) => {
      return res.send({
        success: false,
        message: "a server occured",
        data: null,
      });
    });
};

const requestMoneyController = (req, res) => {
  let { from, amount, user } = req.body;
  let phone_number = `0${from.slice(-10)}`;
  //get user by phone number
  getUserByPhoneNumber(phone_number)
    .then((response) => {
      if (response.error) {
        return res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }
      if (response.data.length < 1) {
        return res.send({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      getUserById(user).then((response1) => {
        if (response1.error) {
          return res.send({
            success: false,
            message: response1.error.message,
            data: null,
          });
        }

        let requester = response1.data[0].name;

        let payload = {
          from: user,
          to: response.data[0].uuid,
          type: "CASH REQUEST",
          msg: `You have a cash request of ${amount} from ${requester}`,
          data: {
            amount: amount,
          },
        };
        insertNotification(payload)
          .then((response) => {
            if (response.error) {
              return res.send({
                success: false,
                message: response.error.message,
                data: null,
              });
            }

            res.send({
              success: true,
              message: "Cash Request Successful!",
              data: null,
            });
          })
          .catch((error) => {
            return res.send({
              success: false,
              message: "a server occured",
              data: null,
            });
          });
      });
    })
    .catch((error) => {
      return res.send({
        success: false,
        message: "a server occured",
        data: null,
      });
    });
};

const fetchNotificationController = (req, res) => {
  let { user } = req.body;
  fetchNotificationByUUID(user)
    .then((response) => {
      if (response.error) {
        return res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }

      // check if the UUID exists
      if (response.data.length < 1) {
        return res.send({
          success: false,
          message: "Invalid user id",
          data: null,
        });
      }

      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        success: false,
        message: "a server error occured",
        data: null,
      });
    });
};

const decisionController = (req, res) => {
  let { id, user, status } = req.body;

  fetchNotificationById(id)
    .then((response) => {
      if (response.error) {
        return res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }

      // check if the UUID exists
      if (response.data.length < 1) {
        return res.send({
          success: false,
          message: "Invalid notification id",
          data: null,
        });
      }

      let userID = response.data[0].to;
      let requesterID = response.data[0].from;
      let amount = response.data[0].meta_data.data.amount;

      if (user === userID && status === "decline") {
        let payload = {
          from: userID,
          to: requesterID,
          type: "CASH REQUEST DECLINED",
          msg: `Cash request declined.`,
          data: null,
        };

        insertNotification(payload).then((response2) => {
          if (response2.error) {
            return res.send({
              success: false,
              message: response2.error.message,
              data: null,
            });
          }

          res.send({
            message: "cash request declined",
          });
        });
      }

      if (user === userID && status === "accept") {
        getPrivateUserById(userID)
          .then((userResponse) => {
            if (userResponse.error) {
              return res.send({
                success: false,
                message: userResponse.error.message,
                data: null,
              });
            }

            // check if the UUID exists
            if (userResponse.data.length < 1) {
              return res.send({
                success: false,
                message: "Invalid user id",
                data: null,
              });
            }

            // get the receiver
            getPrivateUserById(requesterID)
              .then((requesterResponse) => {
                if (requesterResponse.error) {
                  return res.send({
                    success: false,
                    message: requesterResponse.error.message,
                    data: null,
                  });
                }

                // check if the UUID exists
                if (requesterResponse.data.length < 1) {
                  return res.send({
                    success: false,
                    message: "Invalid requester id",
                    data: null,
                  });
                }

                // declare two variables
                let userData = userResponse.data.user.user_metadata;
                let requesterData = requesterResponse.data.user.user_metadata;

                // check if the sender has enough money
                if (userData.wallet < amount) {
                  return res.send({
                    success: false,
                    message: "Insufficient funds",
                    data: null,
                  });
                }

                let userNewWalletBalance = userData.wallet - amount;
                let requesterNewWalletBalance =
                  requesterData.wallet + parseInt(amount);

                // update user data
                let userNewData = { wallet: userNewWalletBalance };

                // update requester data
                let requesterNewData = { wallet: requesterNewWalletBalance };

                // updating user info
                updateUserInfoModel({ UUID: userID, data: userNewData })
                  .then((response5) => {
                    if (response5.error) {
                      return res.send({
                        success: false,
                        message: response5.error.message,
                        data: null,
                      });
                    }

                    // updating receiver info
                    updateUserInfoModel({
                      UUID: requesterID,
                      data: requesterNewData,
                    })
                      .then((response6) => {
                        if (response6.error) {
                          return res.send({
                            success: false,
                            message: response6.error.message,
                            data: null,
                          });
                        }

                        let payload = {
                          from: userID,
                          to: response.data[0].from,
                          type: "CASH REQUEST ACCEPTED",
                          msg: `Cash request accepted, ${amount} has been sent to ${userID} `,
                          data: {
                            amount: amount,
                          },
                        };

                        insertNotification(payload)
                          .then((response3) => {
                            if (response3.error) {
                              return res.send({
                                success: false,
                                message: response3.error.message,
                                data: null,
                              });
                            }

                            res.send({
                              message: "cash request accepted",
                              data: {
                                requester: requesterData.wallet,
                                receiver: userData.wallet,
                              },
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            return res.send({
                              success: false,
                              message: "a server error occured",
                              data: null,
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        return res.send({
                          success: false,
                          message: "a server error occured",
                          data: null,
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    return res.send({
                      success: false,
                      message: "a server error occured",
                      data: null,
                    });
                  });
              })
              .catch((error) => {
                console.log(error);
                return res.send({
                  success: false,
                  message: "a server error occured",
                  data: null,
                });
              });
          })
          .catch((error) => {
            console.log(error);
            return res.send({
              success: false,
              message: "a server error occured",
              data: null,
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        success: false,
        message: "a server error occured",
        data: null,
      });
    });
};

module.exports = {
  sendMoneyController,
  addMoneyController,
  requestMoneyController,
  fetchNotificationController,
  decisionController,
};
