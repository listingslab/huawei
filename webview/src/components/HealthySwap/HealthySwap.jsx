/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 12/02/2017
 * components/HealthySwap/HealthySwap
 */

 /*


 {editBtn}
 */

import React, { PropTypes } from 'react';
import EditLink from '../../components/EditLink/EditLink';
import './HealthySwap.scss';

function HealthySwap(props) {
  const unhealthyImage = props.swapData.acf.image.url || '/img/swaps/chips.jpg';
  const bannerTitle = props.swapData.acf.unhealthy_food_title || 'Swap this';

  const swap1TextH2 = { __html: props.swapData.acf.healthy_swap_1 };
  const swap2TextH2 = { __html: props.swapData.acf.healthy_swap_2 };
  const swap3TextH2 = { __html: props.swapData.acf.healthy_swap_3 };

  const swap1Image = props.swapData.acf.healthy_swap_image_1 || '/img/swaps/no_image.jpg';
  const swap2Image = props.swapData.acf.healthy_swap_image_2 || '/img/swaps/no_image.jpg';
  const swap3Image = props.swapData.acf.healthy_swap_image_3 || '/img/swaps/no_image.jpg';
  const editUrl = `http://api.healthylunchbox.com.au/wp-admin/post.php?post=${props.swapData.ID}&action=edit`;
  let editBtn = null;
  if (editor) { editBtn = (<EditLink editUrl={editUrl} />); }

  return (
    <div className="swap-wrap container">

      <div className="row row-eq-height hidden-xs">
        <div className="col-sm-4 col-xs-12 swap-header-banner">
        <div className="swap-image-overlay">
          <img
            alt={''}
            src={unhealthyImage}
            className="img-responsive"
          />
        </div>
      </div>

      <div className="col-sm-8 col-xs-12 swap-header-banner">
        <div className="swap-header-text">
          <h2>{bannerTitle}</h2>
        </div>
        </div>
      </div>

      <div className="row visible-xs">
        <div className="col-xs-12 swap-header-banner ">
          <div className="swap-image-overlay-small">
            <img
              alt={''}
              src={unhealthyImage}
              className="img-responsive"
            />
          </div>
        </div>


        <div className="col-xs-12 swap-header-banner">
          <div className="swap-header-text">
            <h2>{bannerTitle}</h2>
          </div>
        </div>
      </div>

      <div className="row swap-header-arrows-row row-eq-height">
        <div className="col-sm-4 col-xs-12">
          <div className="swap-header-banner-arrow" />
        </div>
        <div className="col-sm-4 hidden-xs">
          <div className="swap-header-banner-arrow" />
        </div>
        <div className="col-sm-4 hidden-xs">
          <div className="swap-header-banner-arrow" />
        </div>
      </div>

      <div className="row">

       <div className=" col-md-4 col-sm-4 col-xs-6">
          <div className="swap-item">
           <img
             alt={''}
             src={swap1Image}
             className=" img-responsive"
           />
         <div className="swap-content">
           <h3 dangerouslySetInnerHTML={swap1TextH2} />
         </div>
         </div>
       </div>

         <div className=" col-md-4 col-sm-4 col-xs-6">
          <div className="swap-item">
           <img
             alt={''}
             src={swap2Image}
             className="img-responsive"
           />
         <div className="swap-content">
           <h3 dangerouslySetInnerHTML={swap2TextH2} />
         </div>
         </div>
       </div>

       <div className=" col-md-4 col-sm-4 col-xs-12">
          <div className="swap-item">
           <div className="swap-img">
             <img
               alt={''}
               src={swap3Image}
               className="img-responsive"
             />
            </div>
         <div className="swap-content">
           <h3 dangerouslySetInnerHTML={swap3TextH2} />
         </div>
         </div>
       </div>

    </div>
    {editBtn}

    </div>
  );
}

HealthySwap.propTypes = {
  swapData: PropTypes.any.isRequired
};

export default HealthySwap;
