using System;
using System.Collections.Generic;
using api;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace api.Data
{
    public class QuizzerDbContext : DbContext
    {

        public DbSet<Quiz> Quizzes { get; set; }


        public string DbPath { get; private set; }

        public QuizzerDbContext()
        {

            DbPath = $"{Environment.CurrentDirectory}{System.IO.Path.DirectorySeparatorChar}carna.db";

        }


        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Question>()
                .HasDiscriminator(b => b.Type)
                .HasValue<SingleChoiceQuestion>(QuestionType.SINGLE_CHOICE)
                .HasValue<StringAnswerQuestion>(QuestionType.STRING_ANSWER)
                .HasValue<MultipleChoiceQuestion>(QuestionType.MULTIPLE_CHOICE);


            modelBuilder.Entity<Quiz>()
            .Property(e => e.Questions)
            .HasConversion<string>(
                value => JsonConvert.SerializeObject(value),
                value => JsonConvert.DeserializeObject<List<Question>>(value)
                );

            modelBuilder.Entity<MultipleChoiceQuestion>()
            .Property(x => x.Answer)
            .HasColumnName("Answer")
            .HasConversion<string>(
                value => JsonConvert.SerializeObject(value),
                value => JsonConvert.DeserializeObject<List<string>>(value));

            modelBuilder.Entity<MultipleChoiceQuestion>()
           .Property(x => x.Options)
           .HasConversion<string>(
                value => JsonConvert.SerializeObject(value),
                value => JsonConvert.DeserializeObject<List<QuestionOption>>(value));

            modelBuilder.Entity<SingleChoiceQuestion>()
            .Property(x => x.Answer)
            .HasColumnName("Answer");

            modelBuilder.Entity<SingleChoiceQuestion>()
            .Property(x => x.Options)
            .HasColumnName("Options")
            .HasConversion<string>(
                value => JsonConvert.SerializeObject(value),
                value => JsonConvert.DeserializeObject<List<QuestionOption>>(value));


            modelBuilder.Entity<StringAnswerQuestion>()
            .Property(x => x.Answer)
            .HasColumnName("Answer");

            modelBuilder.Entity<MultipleChoiceQuestion>()
            .Property(x => x.Options)
            .HasColumnName("Options")
            .HasConversion<string>(
                value => JsonConvert.SerializeObject(value),
                value => JsonConvert.DeserializeObject<List<QuestionOption>>(value));



        }
    }

}