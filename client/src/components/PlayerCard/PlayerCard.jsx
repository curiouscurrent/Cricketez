import React, { useEffect, Fragment } from "react";
import { useState } from "react";
import { fetchTokenDetails } from "../../api/playerMetadata";
import { Card, Spinner, Button } from "react-bootstrap";
import "./PlayerCard.css";
import { useNavigate } from "react-router-dom";
import { teamColors } from "../../constants/teamColors";
import { motion, AnimatePresence } from "framer-motion";
import { LinkContainer } from "react-router-bootstrap";

export default function PlayerCard(props) {
  const { data } = props;
  const [tokenDetails, setTokenDetails] = useState();
  const histroy = useNavigate();

  useEffect(() => {
    fetchTokenDetails(data.key).then((res) => setTokenDetails(res));
  }, [data.key]);

  const navigate = () => {
    histroy.push(`/card/${tokenDetails.token_id}`, tokenDetails);
  };

  const variants = {
    visible: { opacity: 1, transition: { duration: 0.75 } },
    hidden: { opacity: 0 },
  };

  const SkeletonCard = () => (
    <AnimatePresence>
      <motion.div
        className="card-container"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.75, type: "tween" } }}
      >
        <Card className="player-card">
          <Card.Body>
            <div className="wrapper-dark">
              <div className="card-upper">
                <div className="card-price-heading">Price</div>
                <div className="card-price-section">
                  <div className="price-value loader">Loading...</div>
                </div>
                <div className="card-usd-heading">$ 0.00</div>
              </div>
            </div>
          </Card.Body>
          <div className="player-image"></div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );

  return tokenDetails ? (
    <motion.div
      className="card-container"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <Card className="player-card" onClick={navigate}>
        <Card.Body>
          <div className="wrapper-dark">
            <div className="card-upper">
              <div className="card-price-heading">
                {tokenDetails.sale.price ? (
                  "Price"
                ) : (
                  <a
                    className="sell-button"
                    style={{
                      backgroundColor: teamColors[tokenDetails.team],
                      zIndex: 2,
                    }}
                  >
                    Sell
                  </a>
                )}
              </div>
              <div className="card-price-section">
                {tokenDetails.sale.price ? (
                  <Fragment>
                    <div className="price-value">
                      {parseFloat(
                        parseInt(tokenDetails.sale.price) / 1000000
                      ).toFixed(2)}
                    </div>
                    <img
                      className="tez-logo"
                      src={require("../../assests/tez-logo.png")}
                    />
                  </Fragment>
                ) : (
                  <div className="price-value">Owned</div>
                )}
              </div>
              <div className="card-usd-heading">
                {tokenDetails.sale.price ? "$ 26.75" : "$ 0.00"}
              </div>
            </div>
          </div>
        </Card.Body>
        <div className="player-image">
          <img className="playerimage" src={tokenDetails.image_url} alt="img" />
        </div>
        <div
          className="card-lower"
          style={{ backgroundColor: teamColors[tokenDetails.team] }}
        >
          <div className="player-name-section">
            <div className="player-firstname">
              {tokenDetails.name.split(" ")[0]}
            </div>
            <div className="player-lastname">
              {tokenDetails.name.split(" ")[1]}
            </div>
            <div className="player-role">{tokenDetails.image_url.role}</div>
          </div>
          <div className="team-logo">
            <img src={require("../../assests/rcb-logo.png")} alt="" />
          </div>
          <div className="card-score-section">
            <div className="score-heading">Card Score</div>
            <div className="score-value">
              {parseFloat(tokenDetails.card_score).toFixed(2)}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  ) : (
    <SkeletonCard />
  );
}
