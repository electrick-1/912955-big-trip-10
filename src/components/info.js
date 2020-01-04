const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);
  const monthName = startDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTCTimestamp).getDate();

  return (`${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`);
};

export const getTripInfo = (cards) => {
  let cost = 0;
  cards.forEach((card) => {
    cost += card.price;
    card.offers.forEach((offer) => {
      cost += offer.price;
    });
  });
  return (`
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${cards[0].city}
        ${cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash;`}
        ${cards[cards.length - 1].city}
      </h1>
      <p class="trip-info__dates">${getDuration(cards[0].startDate, cards[cards.length - 1].endDate)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  `);
};
