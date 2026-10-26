insert into public.tracks (slug, title, description, capacity, sort_order) values
  ('quantum-computing', 'Quantum Computing: What Every Student Must Know', 'India has a National Quantum Mission. IBM and Google are racing toward fault-tolerant quantum computers. Companies are already hiring quantum-aware talent. Cuts through the hype: what quantum actually is, what it means for your future, what to do now. No physics PhD required.', 60, 1),
  ('data-science', 'Data Science & Analytics in Practice', 'Real datasets, real tools: Python, SQL, Power BI, Tableau. Extract insights that drive decisions. Domain-agnostic, relevant to management and CS students alike.', 60, 2),
  ('product-thinking', 'Product Thinking & Building for Users', 'User research, wireframing, MVP mindset, and the gap between a technical solution and something people actually use. Bridges technology and business.', 60, 3),
  ('leadership-brand', 'Student Leadership & Personal Brand', 'Leading a team when no one has to follow you. Building a presence that opens doors on LinkedIn, GitHub and in rooms where decisions get made. Leadership as a learnable skill.', 60, 4),
  ('communication', 'Communication, Storytelling & Public Speaking', 'Speak so people listen, write so people read, tell a story that makes someone care. The most universally valuable skill and the one most students never formally learn.', 60, 5)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.workshops (slug, title, description, capacity, sort_order) values
  ('build-ai-agent', 'Build an AI Agent', 'Build a working AI agent with available tools and APIs; leave with a functioning prototype you built yourself.', 100, 1),
  ('cyber-ctf', 'Cyber CTF Lab', 'Mentor-guided Capture The Flag: intro to ethical hacking, problem-solving under pressure, the security mindset.', 100, 2),
  ('design-thinking', 'Design Thinking', 'Empathize, define, ideate, prototype, test on a real-world problem. No design background required.', 100, 3)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;
