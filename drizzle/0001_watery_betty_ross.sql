CREATE TABLE `clinic_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clinicName` varchar(100) NOT NULL,
	`isPreferred` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clinic_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `screening_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`partAScore` int NOT NULL DEFAULT 0,
	`likelihood` varchar(20) NOT NULL DEFAULT 'Low',
	`q1Response` int,
	`q2Response` int,
	`q3Response` int,
	`q4Response` int,
	`q5Response` int,
	`q6Response` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `screening_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vitals_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`systolicBP` int NOT NULL,
	`diastolicBP` int NOT NULL,
	`heartRate` int NOT NULL,
	`medicationReadiness` varchar(20) NOT NULL DEFAULT 'Requires Review',
	`notes` text,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vitals_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `clinic_preferences` ADD CONSTRAINT `clinic_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `screening_results` ADD CONSTRAINT `screening_results_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vitals_records` ADD CONSTRAINT `vitals_records_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;