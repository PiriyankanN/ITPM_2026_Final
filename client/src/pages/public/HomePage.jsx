import PageHeader from "../../components/PageHeader";

function HomePage() {
  const cards = [
    {
      title: "Accommodation",
      value: "Rooms",
      description: "Add and manage room listings for student living."
    },
    {
      title: "Inquiries",
      value: "Support",
      description: "Keep track of student questions and responses."
    },
    {
      title: "Food Services",
      value: "Meals",
      description: "Show nearby meal options and filter by meal type."
    },
    {
      title: "Bus Routes",
      value: "Transport",
      description: "Store route details and nearby landmarks."
    }
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Use the navigation to manage rooms, inquiries, food services, and bus routes."
      />

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <h3>{card.title}</h3>
            <div className="stat-number">{card.value}</div>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
