export type FAQ = {
  id: string;
  topic:
    | "Payroll"
    | "Attendance"
    | "Leave"
    | "Recruitment"
    | "Performance"
    | "Employee Records"
    | "Security"
    | "Pricing"
    | "Integrations"
    | "Support";
  question: string;
  answer: string;
};

export const FAQS: FAQ[] = [
  {
    id: "yourofficehr",
    topic: "Employee Records",
    question: "What is YourOfficeHR?",
    answer:
      "YourOfficeHR is an enterprise HR platform that brings employee management, attendance tracking, leave requests, payroll workflows, and recruitment processes into one modern workspace. It also centralizes document management and org chart visibility so leaders can understand workforce structure at a glance. With multi-device access and a streamlined approval model, YourOfficeHR helps teams reduce manual work while keeping every update auditable and consistent.",
  },
  {
    id: "features",
    topic: "Employee Records",
    question: "What features does YourOfficeHR include?",
    answer:
      "YourOfficeHR includes core employee management with profile and document management, attendance tracking with exception handling, leave management with policy-driven balances, and payroll workflows. It also supports recruitment pipelines, performance management cycles, and reporting & analytics for workforce decisions. Role-based permissions ensure the right people can access the right information, while the organization chart and change logs keep HR operations transparent.",
  },
  {
    id: "security",
    topic: "Security",
    question: "Is my data secure with YourOfficeHR?",
    answer:
      "Yes. YourOfficeHR is built for cloud security with secure data handling practices and role-based permissions that limit access to sensitive HR, payroll, and employee records. Approvals help reduce accidental changes, and every significant update can be tracked through audit-friendly histories. You can also apply governance controls for restricted actions, supporting compliance processes and strengthening internal accountability across HR teams.",
  },
  {
    id: "integrations",
    topic: "Integrations",
    question: "Can I integrate YourOfficeHR with other tools?",
    answer:
      "YourOfficeHR is designed to work alongside your existing systems. You can connect it with common enterprise tools such as identity providers and HR-related applications through supported integrations, enabling smoother onboarding and consistent data flow. For teams without direct connectors, structured exports and import workflows can help keep records aligned. This reduces duplicate entry and helps maintain accurate employee data across platforms.",
  },
  {
    id: "mobile",
    topic: "Attendance",
    question: "Is YourOfficeHR mobile-friendly?",
    answer:
      "Yes. YourOfficeHR is mobile-friendly and supports multi-device access so employees and managers can view schedules, submit leave, and handle time and attendance tasks from anywhere. The experience is designed to remain clear on smaller screens while still preserving the key workflow steps for approvals and updates. This helps HR and managers stay responsive without being tied to a desktop.",
  },
  {
    id: "support",
    topic: "Support",
    question: "Do you offer customer support?",
    answer:
      "YourOfficeHR includes customer support designed for enterprise HR teams. You’ll receive onboarding guidance, best-practice recommendations, and help mapping your workflows to the platform. The support process is built to be responsive: you can track issues, escalate when needed, and get clear next steps so operations don’t stall. This ensures a smoother roll-out and sustained productivity after go-live.",
  },
  {
    id: "pricing",
    topic: "Pricing",
    question: "What is the pricing of YourOfficeHR?",
    answer:
      "Pricing for YourOfficeHR is designed to scale with your organization. It’s typically based on headcount and the modules you activate—such as payroll workflows, attendance tracking, leave management, recruitment, performance management, and reports & analytics. This structure helps you avoid paying for capabilities you don’t need, while giving you a clear path to expand when your HR operating model grows.",
  },
  {
    id: "customization",
    topic: "Employee Records",
    question: "Can I customize the platform for my business?",
    answer:
      "Absolutely. YourOfficeHR can be configured to match how your organization operates, including workflow steps, permissions, and structured data for employee records. Teams can align attendance and leave handling with their policies, and adjust recruitment or performance processes to fit recurring cycles. With role-based permissions and governance controls, customization supports both usability and compliance—without sacrificing data consistency or auditability.",
  },
  {
    id: "implementation",
    topic: "Support",
    question: "How long does implementation take?",
    answer:
      "Implementation timelines vary based on complexity—such as data migration scope, workflow requirements, and integration needs. Many teams can begin a controlled go-live once core employee records, approvals, and foundational processes are configured. YourOfficeHR supports a structured rollout approach so HR can validate outcomes early, reduce risk, and then expand to additional modules like payroll, recruitment, and performance management in a predictable sequence.",
  },
  {
    id: "trial",
    topic: "Pricing",
    question: "Is there a free trial available?",
    answer:
      "Yes. YourOfficeHR offers a free trial so you can evaluate the platform with real workflows before committing. During the trial you can explore employee management, attendance tracking, leave requests, document management, and organization chart visibility. You can also test role-based permissions and review reporting & analytics to confirm the system fits your team’s needs. When you’re ready, you can move to a full plan that matches your headcount and module requirements.",
  },
];


