using System;
using System.Collections.Generic;

namespace api.Data
{

    public class Quiz
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public ICollection<Question> Questions { get; set; }

        public Quiz() : base()
        {
            Questions = new List<Question>();
            Id = Guid.NewGuid();
        }
    }





}